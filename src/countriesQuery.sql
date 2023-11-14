select
	cc.country,
    cc.code,
	f.flag
from ccode as cc
inner join
	flags as f
	on f.country ilike cc.country
order by
    random()
limit 1;