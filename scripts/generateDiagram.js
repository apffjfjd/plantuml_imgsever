const fs = require('fs');
const mermaid = require('mermaid');

// Mermaid 다이어그램 예제
const diagramDefinition = `
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`;

mermaid.initialize({ startOnLoad: false });
mermaid.render('diagram', diagramDefinition, (svgCode) => {
    fs.writeFileSync('public/diagram.svg', svgCode);  // public 폴더에 다이어그램을 저장
    console.log('Diagram generated and saved to public/diagram.svg');
});
