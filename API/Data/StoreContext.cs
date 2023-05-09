using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {

        }
        // Each DbSet is a table in the database. In our case, we have a 'Products' table 
        public DbSet<Product> Products { get; set; }
    }
}