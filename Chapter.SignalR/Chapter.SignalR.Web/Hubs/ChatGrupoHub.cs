using Microsoft.AspNetCore.SignalR;

namespace Chapter.SignalR.Web.Hubs
{
    public class ChatGrupoHub : Hub
    {
        public Task SendMessageToGroup(string groupName, string message)
        {
            return Clients.Group(groupName).SendAsync("Send", groupName, Context.ConnectionId, message);
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", groupName, Context.ConnectionId, "entrou no grupo.");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", groupName, Context.ConnectionId, "saiu do grupo.");
        }

        public Task SendPrivateMessage(string user, string message)
        {
            return Clients.Client(user).SendAsync("ReceiveMessage", message);
        }
    }
}
