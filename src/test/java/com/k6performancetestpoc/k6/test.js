import http from 'k6/http';
import {sleep, check} from 'k6';

const query = `
 query getAllProducts {
   products {
     name
     description
     price
     quantity
   }
 }`;

export const options = {
    scenarios: {
        smoke_test: {
            executor: 'constant-vus',
            exec: 'graphqlTests',
            vus: 1,
            duration: '10s',
        },
        http_200: {
            executor: 'constant-vus',
            exec: 'httpTests',
            vus: 200,
            duration: '60s',
            startTime: '10s',
        },
        graphql_200: {
            executor: 'constant-vus',
            exec: 'graphqlTests',
            vus: 200,
            duration: '60s',
            startTime: '10s',
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<200', 'max<1000'], // 95% of requests must complete under 200ms AND max response time should be less than 1s
        http_req_failed: ['rate<0.01'], // less than 1% request failure rate
        'checks{test_type: graphql_errors}': ['rate>0.99'], // more than 99% of graphql request should not have errors
    }
};

export function httpTests() {

    const response = http.get('http://localhost:8080/api/products');

    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time is acceptable': (r) => r.timings.duration < 1000
    });

    sleep(1);
}

export function graphqlTests() {

    const headers = {
        'Content-Type': 'application/json'
    }

    const response = http.post('http://localhost:8080/graphql', JSON.stringify({query: query}), {headers: headers});

    check(response, {
        'graphql response has no errors': (r) => {
            const responseBody = JSON.parse(r.body);
            return !responseBody.errors;
        }
    }, {test_type: 'graphql_errors'})

    sleep(1);
    const responseBody = JSON.parse(response.body);
    if (responseBody.data && responseBody.data.products) {
        const products = responseBody.data.products;
        check(products, {
            'On successful requests received non empty products array (GraphQL tests)': (prods) => Array.isArray(prods) && prods.length > 0,
            'Each successful request product has required fields (GraphQL tests)': (prods) => prods.every(p => p.name && p.description && p.price !== undefined && p.quantity !== undefined)
        });
    }
}
