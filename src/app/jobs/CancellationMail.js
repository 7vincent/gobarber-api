import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    // com o get na frente, posso depois acessar esse metodo como se fosse uma variavel sem precisar instanciar
    return 'CancellationMail'; // cada job tem que ter uma key unica
  }

  // responsável por executar cada tarefa individualmente da fila
  async handle({ data }) {
    const { appointment } = data;

    // console.log('A fila executou');
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às'  H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
