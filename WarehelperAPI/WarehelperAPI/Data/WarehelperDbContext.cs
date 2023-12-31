﻿
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WarehelperAPI.Auth.Model;
using WarehelperAPI.Data.Entities;

namespace WarehelperAPI.Data
{
    public class WarehelperDbContext : IdentityDbContext<WarehelperUser>
    {
        private readonly IConfiguration configuration;
        public DbSet<Company> Companies { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Item> Items { get; set; }

        public WarehelperDbContext(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) 
        {
            optionsBuilder.UseMySQL(configuration.GetConnectionString("MySQL"));
        }
    }
}
