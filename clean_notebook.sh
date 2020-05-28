set -e # exit whan any command fails

echo '✨  Check TypeScript in the whole project';
tsc --noEmit && echo "  ✔ TypeScript is good !"

echo '✨  Pretty notebooks';
for file in ./src/charts/*.ipynb; do
    [ -f "$file" ] || break
    output=${file/\.ipynb/\.py}
    echo "  ✔ writing in $output"
    jq -j '.cells
          | map( select(.cell_type == "code") | .source + ["\n\n"] )
          | .[][]' \
    $file > $output
done

echo '✨  Generate Plant UML images';
ts-node src/docs/convertPlantUml.ts
