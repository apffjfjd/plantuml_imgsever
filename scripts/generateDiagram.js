const fs = require('fs');
const path = require('path');
const mermaid = require('mermaid');
const { exec } = require('child_process');

// 경로 설정
const mmdDir = path.join(__dirname, 'mmd');
const publicDir = path.join(__dirname, 'public');

// Mermaid 초기화
mermaid.initialize({ startOnLoad: false });

// `.mmd` 파일 리스트 가져오기
const mmdFiles = fs.readdirSync(mmdDir).filter(file => file.endsWith('.mmd'));

// `.png` 파일 리스트 가져오기
const pngFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.png'));

// `.mmd` 파일 중 대응되는 `.png` 파일이 없는 파일 찾기
const missingPngFiles = mmdFiles.filter(mmdFile => {
    const pngFileName = path.basename(mmdFile, '.mmd') + '.png';
    return !pngFiles.includes(pngFileName);
});

// `.png` 생성 함수
const generatePng = (mmdFile) => {
    const mmdFilePath = path.join(mmdDir, mmdFile);
    const diagramDefinition = fs.readFileSync(mmdFilePath, 'utf8');
    const pngFilePath = path.join(publicDir, path.basename(mmdFile, '.mmd') + '.png');

    return new Promise((resolve, reject) => {
        // Mermaid CLI를 사용하여 .png 생성
        exec(`npx mmdc -i "${mmdFilePath}" -o "${pngFilePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generating PNG for ${mmdFile}: ${stderr}`);
                reject(error);
            } else {
                console.log(`Generated PNG: ${pngFilePath}`);
                resolve();
            }
        });
    });
};

// `.png` 생성 작업 실행
(async () => {
    if (missingPngFiles.length === 0) {
        console.log('All .mmd files have corresponding .png files.');
        return;
    }

    console.log(`Generating PNGs for ${missingPngFiles.length} missing files...`);
    for (const mmdFile of missingPngFiles) {
        try {
            await generatePng(mmdFile);
        } catch (error) {
            console.error(`Failed to generate PNG for ${mmdFile}:`, error);
        }
    }

    console.log('PNG generation complete.');
})();
