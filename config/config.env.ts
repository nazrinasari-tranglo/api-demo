const env = 'QA'

const environments = {
    DEV: {
        baseUrl: 'https://restful-booker.herokuapp.com/auth'
    },
    QA: {
        baseUrl: 'https://restful-booker.herokuapp.com/auth'
    }
}

const config = environments[env]

export { config }