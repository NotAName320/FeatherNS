document.addEventListener('keyup', function (event) { // keyup may seem less intuitive but it's already the standard in breeze-like scripts and it prevents holding down a key spamming the server
	if (event.shiftKey || event.ctrlKey || event.altKey || document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') { // locks you out of the script while you're holding down a modifier key or typing in an input
		return;
	} else {
		switch (event.code) { // event.code is the key that was pressed
			case 'KeyR': // reload page
				window.location.reload();
				break;
			case 'KeyQ': // go back
				window.history.back();
				break;
			case 'KeyU': // check if you updated
				window.location.assign("https://www.nationstates.net/page=reports/view=self/filter=change/template-overall=none");
				break;
			case 'KeyS': // endorse nation
				if (window.location.href.includes("nation=")) {
					document.getElementsByClassName('endorse button icon wa')[0].click();
				}
				break;
			case 'KeyO': // ban nation
				if (window.location.href.includes("nation=")) {
					document.getElementsByName('ban')[0].click();
				}
				break;
			case 'KeyK': // eject nation
				if (window.location.href.includes("nation=")) {
					document.getElementsByName('eject')[0].click();
				}
				break;
			case 'KeyA': // confirm wa join
				if (window.location.href.includes("page=join_WA")) {
					document.getElementsByClassName('button primary icon approve big')[0].click();
				}
				else {
					navigator.clipboard.writeText(document.getElementsByClassName('bellink quietlink')[0].href)
				}
				break;
			case 'KeyF': // move to region whose page you're currently on
				if (window.location.href.includes("region=")) {
					document.getElementsByName('move_region')[0].click();
				}
				break;
			case 'KeyB': // move to suspicious
				if (window.location.href == "https://www.nationstates.net/region=suspicious") {
					document.getElementsByName('move_region')[0].click();
				} else {
					window.location.assign("https://www.nationstates.net/region=suspicious");
				}
				break;
			case 'KeyE': // resign from WA
				if (window.location.href == "https://www.nationstates.net/page=un") {
					var chk = document.getElementsByName('chk')[0].value;
					window.location.assign(`https://www.nationstates.net/page=UN_status?action=leave_un&submit=1&chk=${chk}`);
				} else {
					window.location.assign("https://www.nationstates.net/page=un");
				}
				break;
			case 'KeyZ': // go to current region page
				if (window.location.href == "https://www.nationstates.net/page=change_region") { // if on post-relocation page
					document.getElementsByClassName('info')[0].querySelector('a').click(); // click the region link on the relocation page
				} else { // otherwise just click the region link through the sidebar
					document.getElementById('panelregionbar').querySelector('a').click();
				}
				break;
			case 'KeyD': // appoint yourself as and/or deappoint ROs
				var current_nation = document.getElementById("loggedin").getAttribute("data-nname");
				// If on the regional control page, open own regional officer page
				if (window.location.href == "https://www.nationstates.net/page=region_control") {
					window.location.assign("https://www.nationstates.net/page=regional_officer/nation=" + current_nation);
				}
				// If on on own regional officer page, assign officer role
				else if (window.location.href == "https://www.nationstates.net/page=regional_officer/nation=" + current_nation) {
					document.getElementsByName("office_name")[0].value = "moxxie cultist";
					document.getElementsByName("authority_A")[0].checked = true;
					document.getElementsByName("authority_C")[0].checked = true;
					document.getElementsByName("authority_E")[0].checked = true;
					document.getElementsByName("authority_P")[0].checked = true;
					document.getElementsByName('editofficer')[0].click();
				}
				// If on someone else's regional officer page, dismiss them
				else if (window.location.href.includes("regional_officer")) {
					document.getElementsByName('abolishofficer')[0].click();
				}
				// If on none of these pages, open regional control page
				else {
					window.location.assign("https://www.nationstates.net/page=region_control");
				}
				break;
		} // end switch
	} // end else
}); // end event listener