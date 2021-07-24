import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  // Create instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 15,
    userId: '123'
  });

  // Save ticket to DB
  await ticket.save();

  // Fetch ticket twice
  const firstTicketInstance = await Ticket.findById(ticket.id);
  const secondTicketInstance = await Ticket.findById(ticket.id);

  // Make two seperate changes to the tickets 
  firstTicketInstance!.set({ price: 20 });
  secondTicketInstance!.set({ price: 73 });

  // Save first ticket changed
  await firstTicketInstance!.save();

  // Save second ticket and expect error
  try {
    await secondTicketInstance!.save();
  } catch (error) {
    return done();
  }

  throw new Error('Should not reach this point.');
});