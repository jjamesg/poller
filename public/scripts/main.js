var Main = React.createClass({
    getInitialState: function() {
        return (
            {question: '', answers: ['','','',''], display: 'createT'}
        );
    },
    componentDidMount: function() {
        $.get(
            this.props.url + '/user',
            function(user) {
                this.setState({user: user})
            }.bind(this)
        );
    },
    handlePollSubmit: function(e) {
        e.preventDefault();
        var poll = {question: this.state.question, 
                    answers: this.state.answers.filter(Boolean), 
                    user: this.state.user};
        
        console.log('submit')

        $.post(
            this.props.url + '/poll', 
            poll,
            function(id) {
                this.setState({id: id});
                this.setState({display: 'share'});
                $('#share').click();
            }.bind(this)
        );
    },
    handleQuestion: function(e) {
        this.setState({question: e.target.value});
        console.log(e.target.value);
    },
    handleAnswer: function(answer, k) {
        var answers = this.state.answers;
        answers[k] = answer;
        console.log('-', answers)
    
        this.setState({answers: answers});
    },
    addAnswer: function(e) {
        e.preventDefault();
        var answers = this.state.answers;
        answers.push('');
        this.setState({answers: answers});
    },
    deleteAnswer: function(k) {
        var answers = this.state.answers;
        answers = answers.slice(0, k).concat(answers.slice(k+1));
        this.setState({answers: answers});
    },
    
    highlightTab: function(e) {
        console.log(e.target.id)
        this.setState({display: e.target.id});
        $('.tab').css({
            'background': '#ddd',
            'padding': '2% 0 2% 0',
            'border-left': '1px solid #ddd',
            'border-right': '1px solid #ddd'
        });
        $('#'+e.target.id).css({
            'background': 'white',
            'padding': '3% 0 3% 0',
            'border-left': '1px solid #fff',
            'border-right': '1px solid #fff'
        });
    },
    urlClick: function() {
        $('.url-box').select();
    },
    newPoll: function() {
        this.setState({question: ''});
        this.setState({answers: ['','','','']});
        console.log('newpoll')
        $('#createT').click();
    },
    render: function() {
        
        var tabs = (
            <div className='tab-container'>
                <div className='tab' id='createT' onClick={this.highlightTab}>Create</div>
                <div className='tab' id='settings' onClick={this.highlightTab}>Settings</div>
                <div className='tab' id='share' onClick={this.highlightTab}>Share</div>
            </div>
        )
        var pollForm = (
            <div className='poll-form'>
                <CreatePollForm 
                    question={this.state.question}
                    answers={this.state.answers}
                    onQuestion={this.handleQuestion} 
                    onAnswer={this.handleAnswer} 
                    onPollSubmit={this.handlePollSubmit} 
                    deleteAnswer={this.deleteAnswer}
                    addAnswer={this.addAnswer}
                    onSubmit={this.handlePollSubmit}
                />
            </div>
        );
        var shareForm = (
            <div className='share-form'>
                <h3>Your URL: </h3>
                    <input 
                        className='url-box'
                        onClick={this.urlClick}
                        value={this.state.id?
                        this.props.url + '/poll/' + 
                        this.state.id
                    : ''}
                    />
                    <button 
                        className='new-poll-btn'
                        onClick={this.newPoll}
                    >Create a new poll</button>
            </div>
        );
        var settingsForm = (
            <div className='settings-form'>
                Coming soon:<br></br>
                -customize display<br></br>
                -limit votes from unique user<br></br>
                -other stuff
            </div>
        )
        var display = (
            <div>
                <Display 
                    poll= {{
                        question: this.state.question, 
                        answers: this.state.answers
                      }}  
                />
            </div>
            );
        
        return (
            <div className='main'>
                {tabs}
                {this.state.display == 'createT'?
                    pollForm
                : this.state.display == 'share'?
                    shareForm
                : this.state.display == 'settings'?
                    settingsForm
                : ''}
            </div>
            )
        
    }
});

var CreatePollForm = React.createClass({
    render: function() {
        var onAnswer = this.props.onAnswer;
        var deleteAnswer = this.props.deleteAnswer;
        var answers = this.props.answers;
        var answerNodes = this.props.answers.map(function(answer, i) {
            return (
              <div>    
                <Answer 
                  k={i}
                  answer={answers[i]}
                  onAnswerChange={onAnswer}
                  delete={deleteAnswer}
                  placeHolder={i==0? "Type your answers here" : ''}
                />
              </div>
            );
        });
        return(
            <div>
                <input 
                    className='question-in'
                    type="text"
                    placeholder="Type your question here"
                    onChange={this.props.onQuestion}
                    value={this.props.question}
                />
                {answerNodes}
                <button
                    className='add-answer'
                    onClick={this.props.addAnswer} >+</button>
                <button
                    className='submit'
                    onClick={this.props.onPollSubmit}>
                    Submit
                </button>
            </div>
        );
    }
});

var Answer = React.createClass({
    getInitialState: function() {
        return {answer: ''};
    },
    handleAnswerChange: function(e){
        this.setState(
            {answer: e.target.value},
            function() {
                this.props.onAnswerChange(this.state.answer, this.props.k)
            }
        );
    },
    deleteAnswer: function(e) {
        e.preventDefault();
        this.props.delete(this.props.k);
    },
    render: function() {
        return(
            <div className='answer'>
                <input
                    className='answer-in'
                    type="text"
                    value={this.props.answer}
                    placeholder={this.props.placeHolder}
                    onChange={this.handleAnswerChange}
                />
                <button 
                    className='delete-answer'
                    onClick={this.deleteAnswer}>x</button>

            </div>
        );
    }    
});

var Display = React.createClass({
    render: function() {
        var answerNodes = this.props.poll.answers
            .filter(function(answer) {return answer})
            .map(function(answer) {
                return (
                    <h4>{answer}</h4>
                );
            });
            return (
                <div className='display'>
                    <h2>{this.props.poll.question}</h2>
                    {answerNodes}
                </div>
            );
    }
});

$('.url-box').click(function() {
        console.log('clickkk')
        this.select();
    });

var theData = {question: '', answers: ['','','','']};


ReactDOM.render(<Main url='https://pollerq.herokuapp.com/' />, document.getElementById('contentR'));


