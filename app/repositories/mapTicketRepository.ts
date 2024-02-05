import MapTicket from "../models/mapTicketModel";

class MapTicketRepository {
  create(createArgs: any) {
    console.log(createArgs);
    return MapTicket.query().insert(createArgs);
  }


  delete(map_ticket_id: number) {
    return MapTicket.query().deleteById(map_ticket_id);
  }
}

export default new MapTicketRepository();