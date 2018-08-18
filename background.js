chrome.storage.sync.get(['TallyItems'], function(result) 
{
	if(result.TallyItems != null)
	{
		items = result.TallyItems;
		for (let i = 0; i < items.length; i++) 
		{				
			if(items[i].show)
			{
				chrome.browserAction.setBadgeText({text: items[i].number.toString()});
				break;
			}
		}
	}
});