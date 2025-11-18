

class NoteState {
    private static instance: NoteState;
    private valor: string = '';
    private temporalDate: string = '';
    private textPrediction: string = '';

    private constructor() {

    }

    public static getInstance(): NoteState {
        if (!NoteState.instance) {
        NoteState.instance = new NoteState();
        }
        return NoteState.instance;
    }

    public setValor(n: string): void {
        this.temporalDate = n;
        setTimeout(() => {
            if (this.valor === this.temporalDate) {
                this.textPrediction = this.valor;
                console.log('call function to get prediction');
            } else {
                this.valor = this.temporalDate;
            }
            
        }, 2000);
    }

    public getValor(): string {
        return this.valor;
    }
}

export { NoteState };