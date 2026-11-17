export function toBase64(file: File){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    })
}

const GENERIC_ERROR = 'A aparut o eroare! Ne cerem scuze pentru inconvenientul creat.';

/**
 * Turns an HttpErrorResponse from the API into user-facing messages. Handles every body shape the API sends:
 *  - ValidationProblemDetails (model validation): { errors: { field: [msg] } }
 *  - ProblemDetails (HttpStatusException / GlobalExceptionHandler): { title, status, detail }
 *  - plain string (BadRequest("..."), StatusCode(code, "..."))
 *  - array of Identity errors: [{ code, description }]
 * Returns [] for statuses the JWT interceptor already handles (401 refresh/logout, 429 snackbar).
 */
export function parseWebAPIErrors(response: any): string[] {
    const status: number | undefined = response?.status;
    if (status === 401 || status === 429) return [];

    const body = response?.error;

    if (body && typeof body === 'object' && !Array.isArray(body)) {
        // ValidationProblemDetails
        if (body.errors && typeof body.errors === 'object') {
            const result: string[] = [];
            Object.entries(body.errors).forEach(([field, messages]) => {
                const list = Array.isArray(messages) ? messages : [messages];
                list.forEach(message => result.push(field ? `${field}: ${message}` : `${message}`));
            });
            if (result.length > 0) return result;
        }
        // ProblemDetails
        if (typeof body.detail === 'string' && body.detail.trim()) return [body.detail];
    }

    // Plain string body (ignore HTML error pages from IIS / proxies)
    if (typeof body === 'string' && body.trim() && !body.trimStart().startsWith('<')) return [body];

    // Identity errors
    if (Array.isArray(body)) {
        const result = body
            .map((value: any) => typeof value === 'string' ? value : value?.description)
            .filter((value: any): value is string => typeof value === 'string' && value.trim() !== '');
        if (result.length > 0) return result;
    }

    // Not an HTTP error (e.g. failed token refresh): nothing meaningful to show
    if (typeof status !== 'number') return [];
    return [fallbackErrorMessage(status)];
}

/** Single-string version of parseWebAPIErrors, for MessageDialogComponent. */
export function getWebAPIErrorMessage(response: any): string {
    const errors = parseWebAPIErrors(response);
    return errors.length > 0 ? errors.join('\n') : GENERIC_ERROR;
}

function fallbackErrorMessage(status: number): string {
    switch (status) {
        case 0: return 'Serverul nu poate fi contactat. Verificati conexiunea la internet.';
        case 403: return 'Nu aveti drepturi pentru aceasta operatie.';
        case 404: return 'Inregistrarea nu a fost gasita.';
        default: return GENERIC_ERROR;
    }
}

export function formatDateFormData(date: Date){
    date = new Date(date);
    const format = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const [
        {value: month},,
        {value: day},,
        {value: year}
    ] = format.formatToParts(date);

    // yyyy-MM-dd
    return `${year}-${month}-${day}`;
}