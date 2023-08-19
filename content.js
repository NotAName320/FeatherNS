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
					var NationURL = document.getElementsByTagName("form")[1].getElementsByClassName("nlink")[0].href;
					navigator.clipboard.writeText(NationURL);
					document.getElementsByClassName('button primary icon approve big')[0].click();				
				} else {
					navigator.clipboard.writeText(document.getElementsByClassName('bellink quietlink')[0].href)
				}
				break;
			case 'KeyF': // move to region whose page you're currently on
				if (window.location.href.includes("region=")) {
					if (document.getElementsByName('move_region').length == 0) window.location.reload();
					else document.getElementsByName('move_region')[0].click();
				} else if (window.location.href.includes("change_region")) {
					document.getElementsByClassName('rlink')[0].click();
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
                // https://www.nationstates.net/page=un/template-overall=none
                if (window.location.href.includes("https://www.nationstates.net/page=un")) {
    
                    // Not template=none
                    // Button reads "Apply to Join"
                    if (!window.location.href.includes("template-overall=none") 
                    && document.getElementsByTagName("form")[1].getElementsByTagName("button")[0].textContent.includes("Apply to Join")) { 

                        document.getElementsByTagName("form")[1].getElementsByTagName("button")[0].click(); // Apply to join
                         
                    // Template=none
                    // Button reads "Apply to Join"
                    } else if (window.location.href.includes("template-overall=none")
                        && document.getElementsByTagName("form")[0].getElementsByTagName("button")[0].textContent.includes("Apply to Join")) { 

                        document.getElementsByTagName("form")[0].getElementsByTagName("button")[0].click(); // Apply to join
                        
                    // If we are here, neither in nor out of template=none does the button read "Apply to Join"
                    // Ergo, we must RESIGN
                    } else { 
                        // Not template=none, and we can resign
                        if (!window.location.href.includes("template-overall=none")
                            && document.getElementsByTagName("form")[1].getElementsByTagName("button")[0].textContent.includes("Resign")) { 
                            button = document.getElementsByTagName("form")[1].getElementsByTagName("button")[0];
                        }

                        // Check template=none, if we're here we're not here to apply
                        else if (document.getElementsByTagName("form")[0].getElementsByTagName("button")[0].textContent.includes("Resign")) { 
                            button = document.getElementsByTagName("form")[0].getElementsByTagName("button")[0];
                        }

                        // We've identified the resignation button - now we grab the form that it's part of
                        // That form, when submitted, contains the info the site needs to resign. 
                        // Form is unmodified and thus does not need to adhere to simultaneity
                        let submissionForm = button.parentElement.parentElement;
                        submissionForm.requestSubmit(); // Make the resignation request using the OG form
                        
                        // Prevent duplicates by removing the means of execution. 
                        submissionForm.remove();
                    }
                } else {
                    //window.location.assign("https://www.nationstates.net/page=un");
                    window.location.href = "https://www.nationstates.net/page=un/template-overall=none";
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
				var current_nation = document.body.dataset.nname;
				// Assume user is logged in, but in template=none mode following a refresh/relocation
				// In this case, go to the region control panel anyway.
				//window.location.assign("https://www.nationstates.net/page=reports/view=self/filter=change/template-overall=none");
				if (!current_nation) { 
					if (window.location.href.includes("/page=reports/view=self/filter=change/template-overall=none")) { 
						// If on the dossier page, we can get our user from that
						current_nation = document.getElementsByTagName("h1")[0].outerText.toLowerCase().replace(/ /gi,"_").split("'")[0];
						window.location.assign("https://www.nationstates.net/page=regional_officer/nation=" + current_nation);
					} else { 
						window.location.assign("https://www.nationstates.net/page=region_control");
					}
				}
				
				// If on the regional control page, open own regional officer page
				// TODO: Check if RO, then de-RO everyone else in rapid order until all is done
				else if (window.location.href.includes("https://www.nationstates.net/page=region_control")) {
					// document.getElementById("rcontrol_officers").tBodies[0].rows[i].children[4].children[0].children[0].href 
					var encounteredSelf = false;
					var other_ros = [];
					// Skip first
					try { 
						for (i = 1; i < document.getElementById("rcontrol_officers").tBodies[0].rows.length ; i++) { 
							// Check if we are an RO, and build up a list of all non-us ROs who are not the delegate or governor
							if (document.getElementById("rcontrol_officers").tBodies[0].rows[i].children.length == 5) { 
								// Is the RO we're looking at
								// Us
								// Not the Governor
								// Not the Delegate
								// If so, we are an RO, and can move to phase 2.
								// If not, appointing ourselves is priority 1
								if (
									document.getElementById("rcontrol_officers").tBodies[0].rows[i].children[4].firstChild.firstChild.href.includes(current_nation)  
								&& !document.getElementById("rcontrol_officers").tBodies[0].rows[i].children[4].firstChild.firstChild.href.includes("office=governor")
								&& !document.getElementById("rcontrol_officers").tBodies[0].rows[i].children[4].firstChild.firstChild.href.includes("office=delegate")
								) { 
									encounteredSelf = true;
								}

								// Is the RO we're looking at
								// Not the Governor
								// Not the Delegate
								// Not us
								// We can skip evaluating it entirely if it's our own RO, of course. Why not save a CPU cycle?
								else if (
									!document.getElementById("rcontrol_officers").tBodies[0].rows[i].children[4].firstChild.firstChild.href.includes("office=governor") 
								&& !document.getElementById("rcontrol_officers").tBodies[0].rows[i].children[4].firstChild.firstChild.href.includes("office=delegate")
								&& !document.getElementById("rcontrol_officers").tBodies[0].rows[i].children[4].firstChild.firstChild.href.includes(current_nation)  
								) { 

									// Better solution - Check for our nation inside of the appointment text
									if (!document.getElementById("rcontrol_officers").tBodies[0].rows[i].children[2].innerHTML.includes(current_nation)) {
										other_ros.push(document.getElementById("rcontrol_officers").tBodies[0].rows[i].children[4].firstChild.firstChild.href);
									}
								}
							}
						}
					} catch (error) { 
						// Do not abort and go to self - if we have already picked ourself up, so much the better. 
						// Technically, you can use finally to guarantee a result in the event this fails, but all we're doing here
						// is logging to console. So we can skip a finally and just move along.
						console.error('Caught error during RO scan'); 
						console.error(error);
					} 

					// We ARE appointed! Clear to ruin other ROs
					if(encounteredSelf) { 
						console.log("Found self");
						// Another RO exists that we can mess with! Rename/dismiss them
						if (other_ros.length > 0) { 
							console.log(`Dismissing ${other_ros[0]}`);
							window.location = other_ros[0];
							//window.location.assign("https://www.nationstates.net/page=regional_officer/nation=" + other_ros[0]);
						// No other ROs exist, let's rename the governor!
						} else { 
							console.log("Renaming governor");
							window.location.assign("https://www.nationstates.net/page=regional_officer/office=governor");
						}
					} else { 
						console.log("Missing self");
						// Just in case
						if (!current_nation) { 
							current_nation = document.body.dataset.nname;
						}
						window.location.assign("https://www.nationstates.net/page=regional_officer/nation=" + current_nation);
					}

				}
				// If on governor's page, rename 
				else if (window.location.href.includes("office=governor")) { 
					// TODO: Custom governor name
					document.getElementsByName("office_name")[0].value = "nota"
					document.getElementsByName('editofficer')[0].click();
				}
				// If on on own regional officer page, assign officer role
				else if (window.location.href.includes(current_nation) && window.location.href.includes("page=regional_officer")) {
					// TODO: Custom RO name
					document.getElementsByName("office_name")[0].value = "detag"
					document.getElementsByName("authority_A")[0].checked = true;
					document.getElementsByName("authority_C")[0].checked = true;
					document.getElementsByName("authority_E")[0].checked = true;
					document.getElementsByName("authority_P")[0].checked = true;
					document.getElementsByName('editofficer')[0].click();
				}
				// If on someone else's regional officer page, dismiss them (or strip permissions if successor)
				else if (window.location.href.includes("regional_officer")) {
					// If has succession authority, remove all other permissions, since successors cannot be removed by exec WA. Thanks Nota!
					if(document.getElementsByName("authority_S")[0].checked) { 
						document.getElementsByName("authority_A")[0].checked = false;
						document.getElementsByName("authority_B")[0].checked = false;
						document.getElementsByName("authority_C")[0].checked = false;
						document.getElementsByName("authority_E")[0].checked = false;
						document.getElementsByName("authority_P")[0].checked = false;
						document.getElementsByName('editofficer')[0].click();						
					} else { 
						document.getElementsByName('abolishofficer')[0].click();
					}
				}
				// If on none of these pages, open regional control page
				else {
					// Go directly to CURRENT RO page
					window.location.assign("https://www.nationstates.net/page=regional_officer/nation=" + current_nation);
				}
				break;
		} // end switch
	} // end else
}); // end event listener