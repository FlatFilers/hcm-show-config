export const document = {
  title: 'Welcome',
  body: `    
  <div class="my-doc"> 
  <style>
  .my-doc {
    display: flex;
    flex-direction: row;
    margin: 24px;
  }
  .my-doc h1 {
    padding: 0px;
    margin: 0px;
  }
  .my-doc h2 {
    padding: 0px;
    margin: 0px;
  }
  .my-doc p {
    padding: 0px;
    margin: 0px;
  }
  .left {
    border-right: 1px solid #17B9A7;
    margin-right: 48px;
    padding-right: 66px;
    width: 70%;
  }
  .right {
    padding-top: 102px;
  }
  .right > div {
    margin-bottom: 32px;
  }
  .box {
    border: 1px solid #17B9A7;
    padding: 8px;
    margin-bottom: 12px;
    border-radius: 8px;
    box-shadow: 4px 4px 20px 0px #0000001F;
    padding: 24px;
  }
  .box h2 {
    font-size: 16px; 
    font-weight: 600;
  }
  .box p {
    font-size: 14px;
  }
  .items > div {
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;
  }
  .items > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .items > div > svg {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }
  </style>
  
  <div class="left">
  <div style="margin-bottom: 36px;">
  <h1>Welcome!</h1>
  <p style="font-weight: 600;">We're excited to help you import your data to HCM Show.</p>
  </div>
  
  <div>
  <p style="font-weight: 600;">Follow the steps below to get started:</p>
  <div style="margin: 18px 0px; border: 1px solid #000;"></div>
  </div>
  
  <div class="box">
  <h2>1. Upload your file</h2>
  <p>Click "Files" in the left-hand sidebar, and upload the sample data you want to import into Flatfile. You can do this by clicking "Add files" or dragging and dropping the file onto the page.</p>
  </div>
  
  <div class="box">
  <h2>2. Import your Jobs Data</h2>
  <p>Click "Import" and select the Jobs data. Follow the mapping instructions in Flatfile to complete the import. Once the data has been mapped, it will be loaded into Flatfile's table UI, where validations and transformations have been applied.</p>
  </div>
  
  <div class="box">
  <h2>3. Import your Employee Data</h2>
  <p>Click "Import" and select the Employee data. Follow the mapping instructions in Flatfile to complete the import. Once the data has been mapped, it will be loaded into Flatfile's table UI, where validations and transformations have been applied.</p>
  </div>
  
  <div class="box">
  <h2>4. Validate and Transform Data</h2>
  <p>Ensure that the data is correctly formatted and transformed By Flatfile. You can easily address any issues and errors within Flatfile's user interface.</p>
  </div>
  
  <div class="box">
  <h2>5. Load Data into HCM.Show</h2>
  <p>Once the data has been validated and transformed, use the custom action on each sheet to load the data into HCM.Show application.</p>
  </div>
  
  <div class="box">
  <h2>6. Return to HCM.Show</h2>
  <p>Once you have loaded the data from Flatfile to HCM Show, return to HCM.Show and navigate to the Data Templates section within the application to view the Jobs and Employees data that you have just loaded.</p>
  </div>
  
  <!-- left -->
  </div>
  
  <div class="right">
  <div>
  <p style="font-weight: 600;">Flatfile features covered:</p>
  <div style="border: 1px solid #000; margin: 18px 0px;"></div>
  </div>
  
  <div class="items">
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="text-gray-400 mr-2 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path></svg>
  <p>Collaboration</p>
  </div>
  
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="text-gray-400 mr-2 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"></path></svg>
  <p>Plug-in functionality</p>
  </div>
  
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="text-gray-400 mr-2 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path></svg>
  <p>Custom actions</p>
  </div>
  
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="text-gray-400 mr-2 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
  <p>External API Calls</p>
  </div>
  
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="text-gray-400 mr-2 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.104.401l1.445-.889m-8.25.75l.213.09a1.687 1.687 0 002.062-.617l4.45-6.676a1.688 1.688 0 012.062-.618l.213.09"></path></svg>
  <p>Custom Theming</p>
  </div>
  
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="text-gray-400 mr-2 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path></svg>
  <p>Data Hooks</p>
  </div>
  <!-- items -->
  </div>
  
  <div>
  <p style="margin-bottom: 8px;">View the code for this workflow on Github</p>
  <a href="https://github.com/FlatFilers/hcm-show-config/blob/main/workflows/project/index.ts" target="_blank" style="display: inline-block; color: white; text-decoration: none; background-color: #000; padding: 16px 24px;">View on Github</a>
  </div>
  
  <div style="display: flex; flex-direction: column; background-color: #17B9A7; padding: 24px; border-radius: 8px; color: white; max-width: 320px;">
  <svg width="32" height="32" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
  <path d="M9.66347 17.8464H14.3364M11.9999 3.84644V4.84644M18.3639 6.48247L17.6568 7.18958M21 12.8464H20M4 12.8464H3M6.34309 7.18958L5.63599 6.48247M8.46441 16.382C6.51179 14.4294 6.51179 11.2635 8.46441 9.31092C10.417 7.3583 13.5829 7.3583 15.5355 9.31092C17.4881 11.2635 17.4881 14.4294 15.5355 16.382L14.9884 16.9291C14.3555 17.562 13.9999 18.4204 13.9999 19.3154V19.8464C13.9999 20.951 13.1045 21.8464 11.9999 21.8464C10.8954 21.8464 9.99995 20.951 9.99995 19.8464V19.3154C9.99995 18.4204 9.6444 17.562 9.01151 16.9291L8.46441 16.382Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <p style="">Remember, if you need any assistance, you can always refer back to this page by clicking "Welcome" in the left-hand sidebar!</p>
  </div>
  
  <!-- right -->
  </div>
  
  <!-- my-doc -->
  </div>
  
  `,
};
