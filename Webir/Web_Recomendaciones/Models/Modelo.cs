using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace Web_Recomendaciones.Models
{
    public class Modelo : DbContext
    {
        public Modelo()
            : base("name=ModeloRecoRepo")
        {
            Configuration.ProxyCreationEnabled = true;
            Configuration.LazyLoadingEnabled = true;
        }

        public virtual DbSet<Usuario> Usuario { get; set; }
        public virtual DbSet<Recomendaciones> Recomendaciones { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
        }
    }
}