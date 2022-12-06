using Microsoft.AspNetCore.SignalR;

namespace Chapter.SignalR.Web.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessageAllAsync(string name, string message)
        {
            await Clients.All.SendAsync("ReceiveMessageAll", name, message);
        }
    }
}
