## TODO

- Dasboard page: Button that creates polls. List of polls gets refreshed after submission.
  - Components: Button, list.
  - Endpoints: GET polls, POST poll

- Dashboard/poll/[id]: Fields with options. Add option, text field.
  - Components: Text field, add button. Refresh after submit?
  - Endpoints: DELETE poll, GET POST PUT DELETE option
  
- View/[id]: Vote and view results in real time
  - Components: Vote button adds quantity to option. Chart to view live results connected with websocket.
    - Add vote with option_id as foreign key
  - Enpoints: GET votes of each option, websocket server, POST vote