using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Chapter.SignalR.Web.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        public async Task SendMessageAllAsync(string message)
        {
            var fullName = Context.User.Claims.Where(x => x.Type == "fullName").SingleOrDefault().Value;
            await Clients.All.SendAsync("ReceiveMessageAll", fullName, message);
        }
    }
}
