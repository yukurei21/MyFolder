import { App } from './App.js';
import { EventBus } from '../core/EventBus.js';
import { Registry } from '../core/Registry.js';
import { gameConfig } from '../data/gameConfig.js';
import { FloorBuilder } from '../game/world/FloorBuilder.js';
import { MessageLog } from '../game/services/MessageLog.js';
import { CombatSystem } from '../game/rules/CombatSystem.js';
import { ProgressionSystem } from '../game/rules/ProgressionSystem.js';
import { HungerSystem } from '../game/rules/HungerSystem.js';
import { EnemyBrain } from '../game/ai/EnemyBrain.js';
import { TurnManager } from '../game/turn/TurnManager.js';
import { InputController } from '../game/input/InputController.js';
import { GameController } from '../game/GameController.js';
import { GameRenderer } from '../ui/GameRenderer.js';
import { HudView } from '../ui/HudView.js';
import { LogView } from '../ui/LogView.js';


export function createApp({ canvas, hudRoot, logRoot }) {
  const bus = new EventBus();
  const services = new Registry();

  const messageLog = new MessageLog(gameConfig.log.maxEntries);
  const renderer = new GameRenderer({ canvas, config: gameConfig });
  const hudView = new HudView({ root: hudRoot });
  const logView = new LogView({ root: logRoot });

  services.set('bus', bus);
  services.set('config', gameConfig);
  services.set('messageLog', messageLog);
  services.set('renderer', renderer);
  services.set('hudView', hudView);
  services.set('logView', logView);

  const floorBuilder = new FloorBuilder({ config: gameConfig, messageLog });
  const combatSystem = new CombatSystem({ config: gameConfig, messageLog });
  const progressionSystem = new ProgressionSystem({ config: gameConfig, messageLog });
  const hungerSystem = new HungerSystem({ config: gameConfig, messageLog });
  const enemyBrain = new EnemyBrain({ messageLog });
  const turnManager = new TurnManager({
    combatSystem,
    progressionSystem,
    hungerSystem,
    enemyBrain,
    messageLog,
  });

  const controller = new GameController({
    bus,
    config: gameConfig,
    messageLog,
    floorBuilder,
    turnManager,
  });

  bus.on('game:updated', ({ state, summary, messages }) => {
    renderer.render(state);
    hudView.render(summary);
    logView.render(messages, state.status);
  });

  const inputController = new InputController({
    target: window,
    onCommand: (command) => controller.handleCommand(command),
  });

  return new App({ controller, inputController });
}
