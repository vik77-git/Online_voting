document.getElementById("verify-document").addEventListener("click", async function() {
    const fileInput = document.getElementById("document-upload");
    const documentType = document.getElementById("document-type").value;

    if (fileInput.files.length === 0) {
        Swal.fire({
            icon: "error",
            title: "No File Uploaded",
            text: "Please upload your document for verification.",
        });
        return;
    }

    const formData = new FormData();
    formData.append("document", fileInput.files[0]);
    formData.append("type", documentType);

    Swal.fire({
        title: "Verifying Document...",
        text: "Please wait while we check your eligibility.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const response = await fetch("/verify-document", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: "success",
                title: "Verification Successful",
                text: "Your document has been verified successfully!",
                confirmButtonText: "Proceed"
            }).then(() => {
                window.location.href = "vote.html";
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text: result.message,
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Failed to verify the document. Please try again later.",
        });
    }
});
