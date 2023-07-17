import GamePlay from './GamePlay';
import themes from './themes';
import Team from './Team';
import { generateGoodTeam, generateBadTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import cursors from './cursors';
import getPossibleMoves from './getPossibleMoves';
import getTooltip from './getTooltip';
import GameState from './GameState';
import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Swordsman from './characters/Swordsman';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = null;
    this.selectedPlayerPosition = this.gamePlay.cells.findIndex((el) => el.classList.contains('selected-yellow'));
  }

  init() {
    if (this.gameState === null) {
      this.gameState = GameState.from({
        level: 1,
        state: 'inprocess',
        save: false,
        balls: 0,
        statistics: [],
      });
      GamePlay.showMessage('New game started');
    }

    if (this.gameState.state === 'inprocess') {
      GamePlay.showMessage(`Уровень ${this.gameState.level}`);
      this.gamePlay.drawUi(themes[this.gameState.level]);
      if (!this.gameState.save) {
        if (this.gameState.level === 1) {
          const goodTeamArr = new Team(generateGoodTeam(this.allowedTypes, 1, 2));
          console.log('goodTeamArr');
          console.log(goodTeamArr);

          this.goodTeam = goodTeamArr.toArray().map((character, index) => new PositionedCharacter(
            character,
            this.getInitialPositions(
              [0, 1],
              goodTeamArr.characters.size - 1 === index,
              this.gamePlay.boardSize,
            ),
          ));

          console.log('this.goodTeam');
          console.log(this.goodTeam);

          if (this.checkDuplicates(this.goodTeam).length > 0) {
            this.goodTeam = goodTeamArr.toArray().map((character, index) => new PositionedCharacter(
              character,
              this.getInitialPositions(
                [0, 1],
                goodTeamArr.characters.size - 1 === index,
                this.gamePlay.boardSize,
              ),
            ));
          }

          const badTeamArr = new Team(generateBadTeam(this.allowedTypes, 1, 2));

          this.badTeam = badTeamArr.toArray().map((character, index) => new PositionedCharacter(
            character,
            this.getInitialPositions(
              [this.gamePlay.boardSize - 2, this.gamePlay.boardSize - 1],
              badTeamArr.characters.size - 1 === index,
              this.gamePlay.boardSize,
            ),
          ));

          if (this.checkDuplicates(this.badTeam).length > 0) {
            this.badTeam = badTeamArr.toArray().map((character, index) => new PositionedCharacter(
              character,
              this.getInitialPositions(
                [this.gamePlay.boardSize - 2, this.gamePlay.boardSize - 1],
                badTeamArr.characters.size - 1 === index,
                this.gamePlay.boardSize,
              ),
            ));
          }

          console.log('this.badTeam');
          console.log(this.badTeam);

          this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
          this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
          this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
          this.gamePlay.addNewGameListener(this.getNewGame.bind(this));
          this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
          this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
        } else {
          this.separationToTeams();
          const difference = (this.gameState.level + 1) - this.goodTeam.length;
          console.log('difference');
          console.log(difference);

          const goodTeamArrNew = new Team(generateGoodTeam(this.allowedTypes, 1, difference));
          console.log('goodTeamArrNew');
          console.log(goodTeamArrNew);

          this.goodTeamNew = goodTeamArrNew.toArray().map((character, index) => new PositionedCharacter(
            character,
            this.getInitialPositions(
              [0, 1],
              goodTeamArrNew.characters.size - 1 === index,
              this.gamePlay.boardSize,
            ),
          ));

          if (this.checkDuplicates(this.goodTeamNew).length > 0) {
            this.goodTeamNew = goodTeamArrNew.toArray().map((character, index) => new PositionedCharacter(
              character,
              this.getInitialPositions(
                [0, 1],
                goodTeamArrNew.characters.size - 1 === index,
                this.gamePlay.boardSize,
              ),
            ));
          }

          this.goodTeamNew.forEach((el) => {
            el.character.level += 1;
          });

          console.log('this.goodTeamNew');
          console.log(this.goodTeamNew);

          this.goodTeam = this.goodTeam.map((character, index) => new PositionedCharacter(
            this.goodTeam[index].character,
            this.getInitialPositions(
              [0, 1],
              this.goodTeam.length - 1 === index,
              this.gamePlay.boardSize,
            ),
          ));

          this.goodTeam = this.goodTeam.concat(this.goodTeamNew);

          if (this.checkDuplicates(this.goodTeam).length > 0) {
            this.goodTeam = this.goodTeam.map((character, index) => new PositionedCharacter(
              this.goodTeam[index].character,
              this.getInitialPositions(
                [0, 1],
                this.goodTeam.length - 1 === index,
                this.gamePlay.boardSize,
              ),
            ));
          }

          const badTeamArr = new Team(generateBadTeam(this.allowedTypes, 1, (this.gameState.level + 1)));

          this.badTeam = badTeamArr.toArray().map((character, index) => new PositionedCharacter(
            character,
            this.getInitialPositions(
              [this.gamePlay.boardSize - 2, this.gamePlay.boardSize - 1],
              badTeamArr.characters.size - 1 === index,
              this.gamePlay.boardSize,
            ),
          ));

          this.badTeam.forEach((el) => {
            el.character.level += 1;
          });
        }

        this.generalTeam = this.goodTeam.concat(this.badTeam);

        this.gameState.generalTeam = this.generalTeam;
      } else {
        this.generalTeam = this.gameState.generalTeam;
      }

      this.gamePlay.redrawPositions(this.generalTeam);
      console.log('this.generalTeam');
      console.log(this.generalTeam);
      this.gameState.save = false;
    }
  }

  getInitialPositions(сolumns, last, boardSize) {
    let initialPositions = [];
    if (!initialPositions.length) {
      for (let i = 0; i < сolumns.length; i += 1) {
        for (let j = 0; j < boardSize; j += 1) {
          initialPositions.push(j * boardSize + сolumns[i]);
        }
      }
    }

    const randomIndex = Math.floor((Math.random() * initialPositions.length));
    const randomPosition = initialPositions[randomIndex];
    initialPositions.splice(randomIndex, 1);

    if (last) {
      initialPositions = [];
    }

    return randomPosition;
  }

  checkDuplicates(arr) {
    const arrOfDuplicates = [];
    for (let i = 0; i < arr.length; i++) {
      arrOfDuplicates.push(arr[i].position);
    }
    const duplicates = arrOfDuplicates.filter((number, index, numbers) => numbers.indexOf(number) !== index);
    return duplicates;
  }

  onCellClick(index) {
    if (this.gameState.state === 'inprocess') {
      const selectedPlayer = event.currentTarget.firstElementChild;
      console.log('selectedPlayer');
      console.log(selectedPlayer);

      if (selectedPlayer !== null) {
        this.separationToTeams();
        if (this.selectedPlayerPosition !== -1) {
          this.gamePlay.deselectCell(this.selectedPlayerPosition);
        }

        if (selectedPlayer.classList.contains('bowman') || selectedPlayer.classList.contains('magician') || selectedPlayer.classList.contains('swordsman')) {
          this.getMovePositions(index);
        } else if ((selectedPlayer.classList.contains('daemon') || selectedPlayer.classList.contains('undead') || selectedPlayer.classList.contains('vampire')) && this.selectedPlayerPosition >= 0) {
          this.getDamage(index);
        }
      }

      if (selectedPlayer === null && this.selectedPlayerPosition >= 0 && this.arrOfPossibleMoves.includes(index)) {
        this.getPlayerMovement(index);
      }

      this.gameState.generalTeam = this.generalTeam;
    }
  }

  getMovePositions(index) {
    this.selectedPlayerPosition = index;
    this.gamePlay.selectCell(index);

    const { character } = this.generalTeam.find((el) => el.position === index);
    console.log('character');
    console.log(character);

    [this.arrOfPossibleMoves, this.arrOfPossibleAttacks] = getPossibleMoves(
      this.gamePlay.boardSize,
      index,
      character.possibleMoves,
      character.possibleAttacks,
    );
  }

  getDamage(index) {
    if (this.arrOfPossibleAttacks.includes(index)) {
      const indexOfAttacker = this.generalTeam.findIndex((el) => el.position === this.selectedPlayerPosition);
      const indexOfTarget = this.generalTeam.findIndex((el) => el.position === index);

      if (indexOfAttacker >= 0 && indexOfTarget >= 0) {
        const attacker = this.generalTeam[indexOfAttacker].character;
        const target = this.generalTeam[indexOfTarget].character;
        const damage = Math.floor(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));

        this.gamePlay.showDamage(index, damage).then(() => {
          target.health -= damage;
        }).then(() => {
          this.gamePlay.redrawPositions(this.generalTeam);
        }).then(() => {
          this.checkWin();
          this.computerActions();
        });
      }
      this.gamePlay.selectCell(this.selectedPlayerPosition);
    } else {
      GamePlay.showError('Выберите правильного игрока: Лучника, Мечника или Мага');
    }
  }

  getPlayerMovement(index) {
    const characterInMove = this.generalTeam.findIndex((el) => el.position === this.selectedPlayerPosition);
    if (characterInMove >= 0) {
      this.generalTeam[characterInMove].position = index;
      this.gamePlay.deselectCell(this.selectedPlayerPosition);
      this.selectedPlayerPosition = index;
      this.gamePlay.redrawPositions(this.generalTeam);
      this.onCellClick(index);
      this.checkWin();
      this.computerActions();
    }
  }

  onCellEnter(index) {
    if (this.gameState.state === 'inprocess') {
      if (this.selectedPlayerPosition === -1) {
        event.currentTarget.style.cursor = cursors.notallowed;
      } else if (this.arrOfPossibleMoves.includes(index) && !event.currentTarget.hasChildNodes()) {
        event.currentTarget.style.cursor = cursors.pointer;
        this.gamePlay.selectCell(index, 'green');
      } else {
        event.currentTarget.style.cursor = cursors.notallowed;
      }

      if (event.currentTarget.hasChildNodes()) {
        const { character } = this.generalTeam.find((el) => el.position === index);

        if (character) {
          const message = getTooltip(character);
          this.gamePlay.showCellTooltip(message, index);

          if (character.type === 'bowman' || character.type === 'magician' || character.type === 'swordsman') {
            event.currentTarget.style.cursor = cursors.pointer;
          } else if (character.type === 'daemon' || character.type === 'undead' || character.type === 'vampire') {
            if (this.arrOfPossibleAttacks && this.arrOfPossibleAttacks.includes(index) && this.selectedPlayerPosition > 0) {
              event.currentTarget.style.cursor = cursors.crosshair;
              this.gamePlay.selectCell(index, 'red');
            }
          }
        }
      }
    } else {
      event.currentTarget.style.cursor = cursors.notallowed;
    }
  }

  onCellLeave(index) {
    if (this.gameState.state === 'inprocess') {
      if (event.currentTarget.hasChildNodes()) {
        this.gamePlay.hideCellTooltip(index);
      }

      if (index !== this.selectedPlayerPosition) {
        this.gamePlay.deselectCell(index);
      }
    }
  }

  computerActions() {
    if (this.goodTeam.length > 0 && this.badTeam.length > 0) {
      let indexOfBad = this.badTeam[Math.floor(Math.random() * this.badTeam.length)].position;
      let badPosition = this.generalTeam.findIndex((el) => el.position === indexOfBad);

      let [arrOfPossibleMovesOfBad, arrOfPossibleAttacksOfBad] = getPossibleMoves(
        this.gamePlay.boardSize,
        indexOfBad,
        this.generalTeam[badPosition].character.possibleMoves,
        this.generalTeam[badPosition].character.possibleAttacks,
      );

      let attackedPlayer = this.goodTeam.find((el) => arrOfPossibleAttacksOfBad.includes(el.position)) || null;
      console.log('attackedPlayer');
      console.log(attackedPlayer);

      if (!attackedPlayer) {
        indexOfBad = this.badTeam[Math.floor(Math.random() * this.badTeam.length)].position;
        badPosition = this.generalTeam.findIndex((el) => el.position === indexOfBad);

        [arrOfPossibleMovesOfBad, arrOfPossibleAttacksOfBad] = getPossibleMoves(
          this.gamePlay.boardSize,
          indexOfBad,
          this.generalTeam[badPosition].character.possibleMoves,
          this.generalTeam[badPosition].character.possibleAttacks,
        );

        attackedPlayer = this.goodTeam.find((el) => arrOfPossibleAttacksOfBad.includes(el.position)) || null;
      }

      if (attackedPlayer) {
        const attacker = this.generalTeam[badPosition].character;
        console.log('this.generalTeam[badPosition]');
        console.log(this.generalTeam[badPosition]);

        const target = this.generalTeam[this.generalTeam.findIndex(
          (el) => el.position === attackedPlayer.position,
        )].character;

        const damage = Math.floor(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));
        target.health -= damage;
        this.gamePlay.showDamage(attackedPlayer.position, damage).then(() => {
          this.checkWin();
          this.gamePlay.redrawPositions(this.generalTeam);
        });
      } else {
        const newMove = getNewMove(this.generalTeam);

        function getNewMove(generalTeam) {
          let randomMove = arrOfPossibleMovesOfBad[Math.floor(Math.random() * arrOfPossibleMovesOfBad.length)];
          if (generalTeam.some((el) => el.position === randomMove)) {
            randomMove = getNewMove(generalTeam);
          }
          return randomMove;
        }
        this.generalTeam[badPosition].position = newMove;
        this.gamePlay.redrawPositions(this.generalTeam);
      }
      this.separationToTeams();
    }
  }

  checkWin() {
    const killedPlayer = this.generalTeam.findIndex((el) => el.character.health <= 0);
    if (killedPlayer >= 0) {
      if (this.generalTeam[killedPlayer].position === this.selectedPlayerPosition) {
        this.gamePlay.deselectCell(this.generalTeam[killedPlayer].position);
        this.selectedPlayerPosition = -1;
      }

      this.gamePlay.hideCellTooltip(this.generalTeam[killedPlayer].position);
      this.gamePlay.deselectCell(this.generalTeam[killedPlayer].position);
      this.generalTeam.splice(killedPlayer, 1);
      this.gameState.generalTeam = this.generalTeam;
      this.gamePlay.redrawPositions(this.generalTeam);
    }
    this.separationToTeams();

    if (this.goodTeam.length === 0) {
      this.gameState.state = 'gameOver';
      this.showResults();
    }

    if (this.badTeam.length === 0) {
      this.showResults();
      this.generalTeam.forEach((el) => {
        el.character.levelUp();
      });
      this.selectedPlayerPosition = -1;

      this.gameState.level += 1;
      if (this.gameState.level > 4) {
        this.gameState.state = 'gameOver';
        this.showResults();
      }
      this.init();
    }
  }

  separationToTeams() {
    this.goodTeam = [];
    this.badTeam = [];
    this.generalTeam.forEach((el) => {
      if (el.character.type === 'bowman' || el.character.type === 'magician' || el.character.type === 'swordsman') {
        this.goodTeam.push(el);
      } else {
        this.badTeam.push(el);
      }
    });
  }

  getNewGame() {
    this.gameState = null;
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.newGameListeners = [];
    this.init();
  }

  saveGame() {
    this.stateService.save(this.gameState);
  }

  loadGame() {
    this.gameState = this.stateService.load();

    this.gameState.generalTeam.forEach((el) => {
      const prototype = this.getPrototype(el.character.type);
      el.character.__proto__ = prototype;
    });
    this.gameState.save = true;
    this.init();
  }

  getPrototype(type) {
    let proto;
    switch (type) {
      case 'bowman':
        proto = new Bowman(1).__proto__;
        break;
      case 'magician':
        proto = new Magician(1).__proto__;
        break;
      case 'daemon':
        proto = new Daemon(1).__proto__;
        break;
      case 'swordsman':
        proto = new Swordsman(1).__proto__;
        break;
      case 'vampire':
        proto = new Vampire(1).__proto__;
        break;
      case 'Undead':
        proto = new Undead(1).__proto__;
        break;
    }

    return proto;
  }

  showResults() {
    if (this.goodTeam.length === 0) {
      this.gameState.statistics.push(this.gameState.balls);
      GamePlay.showMessage(`Эта игра окончена. Вы програли. Ваш счёт: ${this.gameState.balls}`);
    }

    if (this.badTeam.length === 0 && this.gameState.level === 4) {
      this.scoringPoints();
      this.gameState.statistics.push(this.gameState.balls);
      GamePlay.showMessage(`Эта игра окончена. Вы победили. Ваш счёт: ${this.gameState.balls},
      Максимальный счёт: ${Math.max(...this.gameState.statistics)}`);
    }

    if (this.badTeam.length === 0 && this.gameState.level <= 3) {
      this.scoringPoints();
      GamePlay.showMessage(`Уровень ${this.gameState.level} успешно пройден. Ваш счёт: ${this.gameState.balls}`);
    }
  }

  scoringPoints() {
    this.gameState.balls += this.goodTeam.reduce((acc, item) => acc + item.character.health, 0);
  }
}
