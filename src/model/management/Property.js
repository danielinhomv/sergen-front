class Property {

    constructor(
        {
            id,
            name,
            place,
            phone_number,
            owner_name,
            user_id
        }
    ) 
    {
        this.id = id;
        this.user_id = user_id
        this.name = name;
        this.place = place;
        this.phone_number = phone_number;
        this.owner_name = owner_name;
    }
}

export default Property;