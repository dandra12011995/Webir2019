using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_Recomendaciones.Content
{
    public class WeightedString : IComparable
    {
        public int Weight{ get; set; }
        public string WString { get; set; }
        public string Url { get; set; }

        public WeightedString(string s, int w)
        {
            Weight = w;
            WString = s;
        }

        public WeightedString(string s, int w, string url)
        {
            Weight = w;
            WString = s;
            this.Url = url;
        }

        public int CompareTo(Object ws)
        {
             
            if (Weight > ((WeightedString)ws).Weight)
                return -1;
            if (Weight < ((WeightedString)ws).Weight)
                return 1;
            return 0;
        }
    }
}