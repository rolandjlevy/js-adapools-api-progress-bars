const $ = el => document.querySelector(el);

const percentage = (key, max) => {
  return (Number(json.data[key]) / max * 100).toFixed(2);
}

const updateProgressBar = (key, value) => {
  $(`.${key} > .bar-wrapper > .bar`).style.width = value;
  $(`.${key} > .bar-label > .percentage`).textContent = value;
}

const maxValues = {
  'active_stake': 508709083296,
  'total_stake': 317943177060,
  'pledged': 90703537495.5,
  'tax_fix': 1133333328.8
};

let json;

const fbclid = 'IwAR2HtMmcgedQR3PGMHSp3oXVwGtZsWUa6Lk4ycl7pYhOa9v2KkMZx7S2iOs';
const pool_id = '943fde2eb40fc5acdbc81c88230b56123231f83453eb72c023bc7707';

const url = `https://js.adapools.org/pools/${pool_id}/summary.json?fbclid=${fbclid}`;

fetch(url)
.then(res => res.json())
.then(result => {
  json = {...result};
  let str = '<ul>\n';
  Object.entries(result.data).forEach(([key, value]) => {
    str += `<li>${key} => ${value}</li>\n`;
  });
  str += '</ul>';
  $('#data-container').innerHTML = str;

  Object.entries(maxValues).forEach(([key, max]) => {
    const value = percentage(key, max) + '%';
    updateProgressBar(key, value);
  });
  
})
.catch(err => {
  $('#data-container').innerHTML = `<p>${err}</p>`;
});