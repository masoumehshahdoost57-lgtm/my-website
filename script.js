// منو
const cameraBtn = document.getElementById("cameraMode");
const galleryBtn = document.getElementById("galleryMode");

// کانتینرها
const cameraContainer = document.getElementById("cameraContainer");
const galleryContainer = document.getElementById("galleryContainer");

const resultText = document.getElementById("result");
let html5QrCode;

// تغییر حالت منو
cameraBtn.onclick = () => {
  cameraBtn.classList.add("active");
  galleryBtn.classList.remove("active");
  cameraContainer.style.display = "block";
  galleryContainer.style.display = "none";
  startCamera();
};

galleryBtn.onclick = () => {
  galleryBtn.classList.add("active");
  cameraBtn.classList.remove("active");
  cameraContainer.style.display = "none";
  galleryContainer.style.display = "block";
  stopCamera();
};

// شروع اسکن دوربین
function startCamera() {
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("reader");
  }

  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices && devices.length) {
        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            handleResult(decodedText);
          },
          (error) => {
            console.warn(error);
          }
        );
      }
    })
    .catch((err) => console.error("Camera error:", err));
}

// توقف دوربین
function stopCamera() {
  if (html5QrCode) {
    html5QrCode.stop().catch(() => {});
  }
}

// اسکن از گالری

document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const galleryQrCode = new Html5Qrcode("reader-temp");
  galleryQrCode
    .scanFile(file, true) // true = verbose
    .then((decodedText) => {
      handleResult(decodedText);
    })
    .catch((err) => {
      alert("کدی در تصویر یافت نشد یا تصویر خیلی کوچک/ناواضح است.");
      console.error(err);
    })
    .finally(() => galleryQrCode.clear());
  
});

// نتیجه‌ی نهایی
function handleResult(decodedText) {
  if (decodedText.startsWith("http")) {
    window.location.href = decodedText;
  }
}

// شروع اولیه
startCamera();

const galleryQrCode = new Html5Qrcode("reader-temp");
galleryQrCode
  .scanFile(file, true)
  .then((decodedText) => {
    handleResult(decodedText);
  })
  .catch((err) => {
    alert("کدی در تصویر یافت نشد.");
    console.error(err);
  })
  .finally(() => {
    galleryQrCode.clear(); // آزاد کردن منابع
  });
