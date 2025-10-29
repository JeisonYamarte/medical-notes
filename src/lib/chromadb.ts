import { CloudClient } from "chromadb";

const client = new CloudClient({
    apiKey: 'ck-2uWHpyU5orhQfgB9oMuYhiBMLzeT7XaC2VqMZJ27mj7B',
    tenant: 'a9e5f6dd-28ec-4f51-813d-1888da0aa4f9',
    database: 'medical-note-dev'
});

export const chromaDbClient = client;