new Vue({
    el: '#app',
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        gameStarted: false,
        combatLog: [],
    },
    computed: {
        playerHealthBarWidth: function () {
            return {width: this.playerHealth + '%'};
        },
        monsterHealthBarWidth: function () {
            return {width: this.monsterHealth + '%'};
        },
    },
    methods: {
        startGame: function () {
            this.combatLog = [];
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.gameStarted = true;
        },
        stopGame: function () {
            this.gameStarted = false;
        },
        attack: function (specialAttack = false) {
            this.playerAttack(specialAttack);
            this.monsterAttack();
        },
        heal: function () {
            this.playerHealth += 10;
            this.logAction('player', 10, true)
            this.monsterAttack();
        },
        playerAttack: function (specialAttack = false) {
            let min = 3;
            let max = 10;

            if (specialAttack) {
                min = 7;
                max = 15;
            }

            const damage = this.randomDamage(min, max)
            this.monsterHealth -= damage;
            this.logAction('player', damage)
        },
        monsterAttack: function () {
            const damage = this.randomDamage(5, 12)
            this.playerHealth -= damage;
            this.logAction('monster', damage)
        },
        randomDamage: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        logAction: function (subject, healthPoints, heal = false) {
            let target;

            if (heal) {
                target = 'himself';
            } else if (subject === 'player') {
                target = 'monster';
            } else {
                target = 'player';
            }

            this.combatLog.push({
                subject: subject,
                target: target,
                healthPoints: healthPoints,
                action: heal ? 'heals' : 'hits',
                class: subject === 'player' ? 'player-turn' : 'monster-turn',
            });
        },
        newGamePopUp: function(message) {
            if (confirm(message)) {
                this.startGame();
            } else {
                this.stopGame();
            }
        }
    },
    watch: {
        playerHealth: function (value) {
            this.playerHealth = Math.max(0, Math.min(value, 100));

            if (this.gameStarted && this.playerHealth <= 0) {
                this.newGamePopUp('You lost. New Game?');
            }
        },
        monsterHealth: function (value) {
            this.monsterHealth = Math.max(0, Math.min(value, 100));

            if (this.gameStarted && this.monsterHealth <= 0) {
                this.newGamePopUp('You win! New Game?');
            }
        },
    }
});
