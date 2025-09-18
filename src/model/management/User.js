class User {
    constructor({ id ,name, password, licence, type_licence, enabled }) {
        this.name = id
        this.name = name;
        this.password = password;
        this.licence = licence;
        this.type_licence = type_licence;
        this.enabled = enabled;
    }
}

export default User;