let video = document.getElementById("video");
let canvas = document.createElement("canvas");
document.body.append(canvas);
let ctx = canvas.getContext("2d");
let displaySize = { width: 1280, height: 720 };

const startStream = () => {
    console.log("**[i] Mencoba memulai Webcam");
    navigator.mediaDevices.getUserMedia({
        video: { width: displaySize.width, height: displaySize.height },
        audio: false
    }).then((stream) => {
        video.srcObject = stream;
    }).catch(err => console.error('Terjadi Error pada saat mengakses webcam: ', err));
};

console.log(faceapi.nets);
console.log("**[i] Mencoba memulai Model");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startStream);

async function detect() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    resizedDetections.forEach(result => {
        const { age, gender, genderProbability } = result;
        new faceapi.draw.DrawTextField([
            `${Math.round(age, 0)} Tahun`,
            `${gender} (${Math.round(genderProbability * 100)}%)`
        ], result.detection.box.bottomRight).draw(canvas);
    });
}

video.addEventListener('play', () => {
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    faceapi.matchDimensions(canvas, displaySize);
    
    setInterval(detect, 100);
});
