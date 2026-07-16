import repository from './repository.js';

class AthleteRepository {
    constructor() {
        this.athletes = [];
    }

    async findAll() {
        const rows = await repository.findAll('athletes');
        return rows.map(row => new Athlete(row));
    }

    async findById(id) {
        const row = await repository.findById('athletes', id);
        return row ? new Athlete(row) : null;
    }
}

export default AthleteRepository;