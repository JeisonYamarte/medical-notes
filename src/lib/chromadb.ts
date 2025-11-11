import { CloudClient } from "chromadb";

const client = new CloudClient({
    apiKey: 'ck-D3JE7pHgiJ9WjeU92WjTP9ybSAeaZ3sAVz23WqMkeaoD',
    tenant: 'a9e5f6dd-28ec-4f51-813d-1888da0aa4f9',
    database: 'pruebaDB'
});

export { client as chromaDbClient };