function dataUriToBlob(dataUri) {
    const b64 = atob(dataUri.split(',')[1]);
    const u8 = Uint8Array.from(b64.split(''), e => e.charCodeAt());
    return new Blob([u8], {type: 'image/png'});
  }
  let imgElement = document.getElementById('imageSrc');
  let inputElement = document.getElementById('fileInput');
  let sizeVar;
  inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
    sizeVar = e.target.files[0].size;
  }, false);
  imgElement.onload = function() {
    let mat = cv.imread(imgElement);
    console.log(mat.size().width + ' x ' + mat.size().height);
    let dst = new cv.Mat();
    let minSize = 130000;
    if(sizeVar > minSize)
    {
      let dsize = new cv.Size(minSize/sizeVar*mat.size().width, minSize/sizeVar*mat.size().height);
      cv.resize(mat, dst, dsize, 0, 0, cv.INTER_AREA);
      cv.imshow('canvasOutput', dst);
    }
    else
    {
      cv.imshow('canvasOutput', mat);
    }
    console.log(mat);
    console.log(dst.size().width + ' x ' + dst.size().height);
    console.log(sizeVar);
    const hiddenCanvas = document.getElementById('canvasOutput');
    const data = hiddenCanvas.toDataURL();
    const url = URL.createObjectURL(dataUriToBlob(data));
    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.addEventListener('click', e => {
      downloadBtn.href = url;
    });
    dst.delete();
    mat.delete();
  };
  function onOpenCvReady() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
  }