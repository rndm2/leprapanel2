$.escapeHTML = function(str) str.replace(/[&"<>]/g, function (m) ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[m]);