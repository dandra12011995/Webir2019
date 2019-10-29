using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Web_Recomendaciones.Models
{
    [Table("Recomendaciones")]
    public class Recomendaciones
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        public string repositorio { get; set; }

        public int cantidad { get; set; }

        public virtual Usuario Usuario { get; set; }
    }
}