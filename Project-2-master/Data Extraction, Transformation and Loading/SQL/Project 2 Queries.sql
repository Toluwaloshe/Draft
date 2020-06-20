CREATE TABLE country_continent (
code VARCHAR(3),
continent_name VARCHAR,
continent_code VARCHAR(2),
country_name VARCHAR,
country_code_2_let VARCHAR(2));

CREATE TABLE GDP_data (
country_name VARCHAR NOT NULL,
code VARCHAR(3) NOT NULL,
year INTEGER NOT NULL,
gdp_growth DECIMAL NOT NULL,
lat FLOAT NOT NULL,
long FLOAT NOT NULL
);

CREATE TABLE fem_workforce_data (
country_name VARCHAR NOT NULL,
code VARCHAR(3) NOT NULL,
year INTEGER NOT NULL,
fem_laborforce DECIMAL NOT NULL,
lat FLOAT NOT NULL,
long FLOAT NOT NULL
);


DROP TABLE IF EXISTS fem_workforce_data;
DROP TABLE IF EXISTS gdp_data;
DROP TABLE IF EXISTS country_continent;
