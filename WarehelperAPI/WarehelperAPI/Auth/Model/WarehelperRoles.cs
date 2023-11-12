namespace WarehelperAPI.Auth.Model
{
    public static class WarehelperRoles
    {
        public const string Admin = nameof(Admin);
        public const string Worker = nameof(Worker);
        public static readonly IReadOnlyCollection<string> All = new[] { Admin, Worker };
    }
}
