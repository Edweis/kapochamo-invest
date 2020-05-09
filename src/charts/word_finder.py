import psycopg2
import matplotlib
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import re

pd.set_option('display.max_rows', 200)

connection = psycopg2.connect(
    user = "postgres", 
    password = "docker", 
    host = "localhost", 
    port = "5432", 
    database = "postgres"
)
cursor = connection.cursor()

resp = cursor.execute("SELECT count(*) FROM performance;")
record = cursor.fetchone()
assert record[0] > 0

cursor.execute("""
    SELECT 
        perf.*,
        news.title,
        news.content,
        news.time
    FROM performance perf
    JOIN news 
        ON news.url = perf.url
    WHERE perf.performance IS NOT NULL
;""")
records = cursor.fetchall()
columns = [desc[0] for desc in cursor.description]
perf_df = pd.DataFrame(records, columns=columns)
print(perf_df.size)
perf_df.sample(3)

meaningless_words = ['to', 'and', 'will', 'of', 'the', 'for', 'on', '', 'by', 'a', 'an', 'as', 'in', 'be', 'has', 'have']
def format_title(title):
    clean_title = re.sub('[^A-Za-z0-9 ]+', ' ', title.lower())
    without_duplicate_space_title = re.sub(' +', ' ',clean_title)
    words = clean_title.split(' ')
    uniq_words = list(set(words))
    meaningful_words = [word for word in uniq_words if word not in meaningless_words]
    return meaningful_words

def mean_5_bests(series):
    """Take the average of the 5 bests element of the serie"""
    if len(series) == 0:
        return null
    bests = sorted(series)[-5:]
    return sum(bests)/len(bests)

assert mean_5_bests([5, 3, 4, 2, 1, 3, 3, 3, 3]) == (5+4+3+3+3)/5

word_df = perf_df.copy()
word_df['words'] = word_df['title'].apply(format_title)

words_exploded_df = word_df \
    .explode('words') \
    .groupby(['words', 'extractor', 'strategy', 'symbol']) \
    .agg(
        count=('words', 'count'), 
        computed_perf=('performance', 'mean')
    ).sort_values(['computed_perf'], ascending=False)

words_exploded_df.head(10)

array = words_exploded_df.reset_index()
strategyFilter = array['strategy'].str.startswith('charly_')
extractorFilter =  array['extractor'] == 'relatedAgainstUsdt'
countFilter = array['count'] > 5
filtered_array = array[
    strategyFilter & 
    extractorFilter &
    countFilter
]\
.groupby(['words', 'extractor', 'strategy', 'symbol'])\
.agg(
        count=('count', 'sum'), 
        computed_perf=('computed_perf', 'mean')
    )\
.sort_values(['computed_perf'], ascending=False)
filtered_array.head(1)

#filtered_array.plot(x='words', y='computed_perf')

hot_words = ['listing', 'list', 'trading']
wordFilter = perf_df['title'].apply(format_title).apply(lambda words: any(word in hot_words for word in words))

strategyFilter = perf_df['strategy'] == 'charly_S30W5L5'
extractorFilter =  perf_df['extractor'] == 'relatedAgainstUsdt'

perf_ser = perf_df[strategyFilter & extractorFilter& wordFilter]['performance']
print(perf_ser.describe())
perf_ser.apply(lambda p: 1+p/100).prod()

