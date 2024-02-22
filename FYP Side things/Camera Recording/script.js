let mediaRecorder;
let parts = [];

document.getElementById('btn').onclick = function() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
        document.getElementById('video').srcObject = stream;

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(1000);

        mediaRecorder.ondataavailable = function(e) {
            parts.push(e.data);
        }
    });
}

document.getElementById('stopbtn').onclick = function() {
    mediaRecorder.stop();
    
    const blob = new Blob(parts, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'test.webm';
    a.click();
}
