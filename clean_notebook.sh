echo 'Pretty notebooks';

for file in ./src/charts/*.ipynb; do
    [ -f "$file" ] || break
    output=${file/\.ipynb/\.py}
    echo " - writing in $output"
    jq -j '.cells
          | map( select(.cell_type == "code") | .source + ["\n\n"] )
          | .[][]' \
    $file > $output
done
