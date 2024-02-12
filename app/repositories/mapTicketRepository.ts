import MapTicket from "../models/mapTicketModel";

class MapTicketRepository {
  create(createArgs: any) {
    return MapTicket.query().insert(createArgs);
  }
  
  update(map_ticket_id: number, updateArgs: any) {
    return MapTicket.query().patchAndFetchById(map_ticket_id, updateArgs);
  }

  delete(map_ticket_id: number) {
    return MapTicket.query().deleteById(map_ticket_id);
  }
}

export default new MapTicketRepository();