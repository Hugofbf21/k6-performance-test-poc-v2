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
        http_200: {
            executor: 'constant-vus',
            exec: 'httpTests',
            vus: 200,
            duration: '120s',
        },
        graphql_200: {
            executor: 'constant-vus',
            exec: 'graphqlTests',
            vus: 200,
            duration: '120s',
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<200'], // 95% of requests must complete under 200ms
        http_req_failed: ['rate<0.01']    // less than 1% request failure rate
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
        'status is 200': (r) => r.status === 200,
        'response time is acceptable': (r) => r.timings.duration < 500
    });

    sleep(1);
}
