export const getArticles = async () => {
    const url = `${import.meta.env.VITE_API_URL}/articles`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
        },
    })

    if (!response.ok) {
        throw new Error('Unable to retrieve Articles')
    }

    const res = await response.json()

    return res
}
