class AthleteSeason {

    constructor(row) {
        this.athleteId = row.athlete_id;
        this.year = row.year;
        this.sb60m = row.sb_60m;
        this.sb100m = row.sb_100m;
        this.sb200m = row.sb_200m;
        this.sb400m = row.sb_400m;
    }
}

export default AthleteSeason;