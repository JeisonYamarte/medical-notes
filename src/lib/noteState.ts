

class NoteState {
    private static instance: NoteState;
    private valor: string = '';

    private constructor() {

    }

    public static getInstance(): NoteState {
        if (!NoteState.instance) {
        NoteState.instance = new NoteState();
        }
        return NoteState.instance;
    }

    public setValor(n: string): void {
        this.valor = n;
    }

    public getValor(): string {
        return this.valor;
    }
}

export { NoteState };