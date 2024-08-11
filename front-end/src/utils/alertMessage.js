export const alertMessage = (ref, message, type = true) => {
    if (ref) {
        const toast = document.createElement('div')

        setTimeout(function () {
            ref.removeChild(toast)
        }, 3000)

        let iconType = 'check-circle'
        let colorType = 'success'
        if (type === false) {
            iconType = 'exclamation-octagon'
            colorType = 'danger'
        }

        toast.innerHTML = `
        <div class="alert alert-${colorType} alert-dismissible fade show py-1" role="alert">
            <i class="bi bi-${iconType} me-1"></i>
            ${message}
            <button type="button" class="btn-close p-2" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
        ref.appendChild(toast)
    }
}