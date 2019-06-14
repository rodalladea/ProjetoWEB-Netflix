function readImage(event) {
    if (event.target.files && event.target.files[0]) {
        var FR = new FileReader();
        FR.onload = function(e) {
            document.getElementById("poster").src = e.target.result;
            document.querySelector("input[name=img]").value = e.target.result;
        };
        FR.readAsDataURL(event.target.files[0]);
    }
}