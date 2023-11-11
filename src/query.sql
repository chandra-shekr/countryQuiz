select 
    c.country,
    c.capital,
    t.flag
from capitals as c
inner join
    flags as t
    on t.id = c.id
order by
    random()
limit 1;