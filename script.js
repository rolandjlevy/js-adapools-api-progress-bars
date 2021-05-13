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

function displayProgressBars(pool_id) {
  const poolUrl = `https://js.adapools.org/pools/${pool_id}/summary.json`;
  fetch(poolUrl)
  .then(res => res.json())
  .then(result => {
    json = {...result};
    let str = '<ul>\n';
    Object.entries(result.data).forEach(([key, value]) => {
      str += `<li>${key} => ${value}</li>\n`;
    });
    str += '</ul>';

    $('.db_name').textContent = result.data.db_name;
    $('.db_url').href = result.data.db_url;

    // $('#data-container').innerHTML = str;

    Object.entries(maxValues).forEach(([key, max]) => {
      const value = percentage(key, max) + '%';
      updateProgressBar(key, value);
    });

  })
  .catch(err => {
    $('#data-container').innerHTML = `<p>${err}</p>`;
  });
}

const pool_id = '943fde2eb40fc5acdbc81c88230b56123231f83453eb72c023bc7707';
displayProgressBars(pool_id);

const poolGroupsUrl = 'https://js.adapools.org/groups.json';

function generateDropdown() {
  fetch(poolGroupsUrl)
  .then(res => res.json())
  .then(results => {
    const groups = [...results];
    // groups.sort((a, b) => a.group - b.group);
    groups.sort((a, b) => {
      return ((a.group < b.group) ? -1 : ((a.group > b.group) ? 1 : 0));
    });
    let str = '<select id="pool-group">\n';
    groups.forEach(item => {
      if (item.group) {
        str += `<option value=${item.pool_id}>${item.group}</option>\n`;
      }
    });
    str += '</select>';
    $('.groups-list').innerHTML = str;
    $('#pool-group').addEventListener('change', (e) => {
      displayProgressBars(e.target.value);
      $('.wrapper').classList.add('fade-in');
    });
  });
}