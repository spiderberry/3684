class Athlete {
    
    constructor(row) {
        this.id = row.id;
        this.firstName = row.first_name;
        this.lastName = row.last_name;
        this.gender = row.gender;
        this.countryId = row.country_id;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

export default Athlete;