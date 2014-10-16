/**
 * Definition d'une classe javascript représentant un canvas SVG
 * @param {JQueryObject} ref Référence à l'objet jquery
 */
function SVGClass(ref) {
  this.ref = ref;
  this.width = this.ref.attr("width");
  this.height = this.ref.attr("height");
  this.cote_min = Math.min(this.width, this.height);
  this.x_centre = this.width / 2;
  this.y_centre = this.height / 2;
}



/**
 * Definition d'une classe représentant un cercle
 * @param {int} xc     x du centre
 * @param {int} yc     y du centre
 * @param {int} radius Rayon du cercle
 * @param {int} hid  parent; sibling; children; current
 */
function Circle(xc, yc, radius, hid) {
  this.xc = xc;
  this.yc = yc;
  this.radius = radius;
  this.hid = hid;

  /**
   * Est ce que le point passé en parametre est contenu dans le cercle ?
   * @param  {int} x     Abscisse du point à tester
   * @param  {int} y     Ordonnée du point à tester
   * @param  int} scale  Permet de mettre à l'echelle le rayon en retranchant ou ajoutant une somme
   * @return {boolean}       Vrai ou faux
   */
  this.contains = function(x, y, scale) {
    var rad = this.radius + scale;
    square_dist = Math.pow((this.xc - x), 2) + Math.pow((this.yc - y), 2);
    return (square_dist <= Math.pow(rad, 2));
  };

  /**
   * Fonction qui gère la couleur des cercles en fonction de leur grade
   * hieratchique
   * @return {String} La couleur
   */
  this.getFillcolor = function() {
    if(this.hid === "parent")
      return "#8EC3CC";
    else if(this.hid === "sibling")
      return "black";
      //return "#F0F27F";
    else if(this.hid === "children")
      return "red";
    else if(this.hid === "current")
      return "black";
      // return "#E4E540";
  };

  /**
   * @return {float} The fill opacity
   */
  this.getFillOpacity = function() {
    return 1;
  };

  /**
   * @return {String} The stroke color
   */
  this.getStrokeColor = function() {

    return "black";
  };

  /**
   * @return {int} The stroke width
   */
  this.getStrokeWidth = function() {
    if(this.hid === "children")
      return 0;
    else if(this.hid === "current")
      return 3;
    else
      return 1;
  };

  /**
   * @return {int} The stroke opacity
   */
  this.getStrokeOpacity = function() {
    if(this.hid === "parent")
      return 0.6;
    else
      return 1;
  };

  /**
   * @return {string} The tooltip text
   */
  this.getTooltipText = function() {
    if(this.hid === "parent")
      return "One of " + nb_parents + " parents";
    else if(this.hid === "sibling")
      return "One of " + nb_siblings + " siblings";
    else if(this.hid === "children")
      return "One of " + nb_children + " children";
    else if(this.hid === "current")
      return "The current object";
  };

  /**
   * Fonction qui permet de dessiner le cercle
   */
  this.draw = function() {
    var title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = this.getTooltipText();
    var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shape.setAttributeNS(null, "cx", this.xc);
    shape.setAttributeNS(null, "cy", this.yc);
    shape.setAttributeNS(null, "r", this.radius);
    shape.setAttributeNS(null, "fill", this.getFillcolor());
    shape.setAttributeNS(null, "fill-opacity", this.getFillOpacity());
    shape.setAttributeNS(null, "stroke", this.getStrokeColor());
    shape.setAttributeNS(null, "stroke-width", this.getStrokeWidth());
    shape.setAttributeNS(null, "stroke-opacity", this.getStrokeOpacity());
    shape.appendChild(title);
    document.getElementById('hierarchy').appendChild(shape);
  };
}







/**
 * Fonction qui dit si il ya a collision
 * @param  {Array}  tab    Tableau contenant l'ensemble des cercles
 * @param  {int}  x_random Abscisse à tester
 * @param  {int}  y_random Ordonnée à tester
 * @param  {int}  rayon    Le rayon en px du cercle à tester
 * @return {Boolean}          Vrai si collision, faux sinon
 */
function isCollision(tab, x_random, y_random, rayon) {
  for(var i=0; i<tab.length; i++) {
    var AB = Math.abs(tab[i].yc - y_random);
    var BC = Math.abs(tab[i].xc - x_random);
    var AC = Math.sqrt(AB*AB + BC*BC);
    if(AC < tab[i].radius + rayon)
      return true;
  }
  return false;
}



/**
 * Fonction qui déssine l'objet courant sous forme de cercle SVG
 * @param  {SVGClass} svg L'objet svg
 * @return {Circle}   Les dimensions du cercle représentant l'objet courant
 */
function drawCurrentObject(svg) {
  var coef = 0.4;
  var current_object = new Circle(svg.x_centre, svg.y_centre, (svg.cote_min/2)*coef, "current");

  current_object.draw();

  return current_object;
}



/**
 * Fonction qui dessine les parents sous forme de cercle
 * @param  {SVGClass} svg        L'objet svg
 * @param  {int} nb_parents Le nombre de parent de l'objet courant
 * @return {Circle}   Le plus petit cercle des parents
 */
function drawParents(svg, nb_parents) {
  var ecart = 3;
  var parent;

  if(nb_parents === 0) {
    parent = new Circle(svg.x_centre, svg.y_centre, svg.cote_min/2, "parent");
  }

  for (var i = 0; i < nb_parents && i < 5; i++) {
    parent = new Circle(svg.x_centre, svg.y_centre, svg.cote_min/2-i*ecart, "parent");
    parent.draw();
  }

  return parent;
}



/**
 * Fonction qui s'occupe de déssiner les siblings
 * @param  {SVGClass} svg            Le canvas svg
 * @param  {int} nb_siblings    Le nombre de siblings à dessiner
 * @param  {Circle} smaller_parent Le cercle représentant le plus petit des parents
 * @param  {Circle} current_object Le cercle représentant l'objet courant
 */
function drawSiblings(svg, nb_siblings, smaller_parent, current_object) {
  var tab_s = [];
  var placer = 0;
  var cpt_colli = 0;

  while(placer < nb_siblings && cpt_colli < 70) {
    var x_random = Math.random() * svg.width;
    var y_random = Math.random()* svg.height;
    var rayon_siblings = 6 + scaleCircleSize(nb_siblings, "sibling");
    rayon_siblings *= Math.min(svg.width, svg.height)/500;

    if(smaller_parent.contains(x_random, y_random, -rayon_siblings) &&
      !current_object.contains(x_random, y_random, +rayon_siblings) ) {

      if( !isCollision(tab_s, x_random, y_random, rayon_siblings) ) {
        var sibling = new Circle(x_random, y_random, rayon_siblings, "sibling");
        sibling.draw();
        tab_s[tab_s.length] = sibling;
        placer++;
        cpt_colli = 0;
      }
      else
        cpt_colli++;
    }
  }
}



/**
 * Fonction qui permet de mettre à l'echelle la taille des cercles en fonction
 * du nombre
 * @param  {int} nb  Le nombre de semblable
 * @param  {String} hid L'identifiant hiérarchique (sibling, children)
 * @return {int}     La taille
 */
function scaleCircleSize(nb, hid) {
  var size;
  var size_max_siblings = 35;
  var size_max_children = 15;

  if(hid === "sibling") {
    if(nb < 10) size = size_max_siblings;
    else if(nb < 20) size = size_max_siblings * 0.7;
    else if(nb < 30) size = size_max_siblings * 0.55;
    else if(nb < 40) size = size_max_siblings * 0.41;
    else if(nb < 50) size = size_max_siblings * 0.35;
    else if(nb < 60) size = size_max_siblings * 0.33;
    else if(nb < 70) size = size_max_siblings * 0.3;
    else if(nb < 80) size = size_max_siblings * 0.25;
    else if(nb < 90) size = size_max_siblings * 0.22;
    else if(nb < 100) size = size_max_siblings * 0.2;
    else if(nb < 120) size = size_max_siblings * 0.17;
    else if(nb < 140) size = size_max_siblings * 0.13;
    else if(nb < 200) size = size_max_siblings * 0.08;
    else size = 0;
  }
  else if(hid === "children") {
    if(nb < 10) size = size_max_children;
    else if(nb < 20) size = size_max_children * 0.7;
    else if(nb < 30) size = size_max_children * 0.55;
    else if(nb < 40) size = size_max_children * 0.41;
    else if(nb < 50) size = size_max_children * 0.35;
    else if(nb < 60) size = size_max_children * 0.33;
    else if(nb < 70) size = size_max_children * 0.3;
    else if(nb < 80) size = size_max_children * 0.25;
    else if(nb < 90) size = size_max_children * 0.22;
    else if(nb < 100) size = size_max_children * 0.2;
    else if(nb < 120) size = size_max_children * 0.17;
    else if(nb < 140) size = size_max_children * 0.13;
    else if(nb < 200) size = size_max_children * 0.08;
    else size = 0;
  }

  return size;
}


/**
 * Fonction qui s'occupe de dessiner les enfants de l'objet courant sous
 * forme de cercles
 * @param  {SVGClass} svg            Canvas SVG
 * @param  {int} nb_children    Nombre d'enfants
 * @param  {circle} current_object Cercle représentant l'objet courant
 */
function drawChildren(svg, nb_children, current_object) {
  var tab_c = [];
  var placer = 0;
  var cpt_colli = 0;

  while(placer < nb_children && cpt_colli < 50) {
    var x_random = Math.random() * (current_object.radius*2) + current_object.xc-current_object.radius;
    var y_random = Math.random() * (current_object.radius*2) + current_object.yc-current_object.radius;
    var rayon_children = 3 + scaleCircleSize(nb_children, "children");
    rayon_children *= Math.min(svg.width, svg.height)/500;

    if(current_object.contains(x_random, y_random, -rayon_children) ) {

      if( !isCollision(tab_c, x_random, y_random, rayon_children) ) {
        var child = new Circle(x_random, y_random, rayon_children, "children");
        child.draw();
        tab_c[tab_c.length] = child;
        placer++;
        cpt_colli = 0;
      }
      else
        cpt_colli++;
    }
  }
}



$(document).ready(function() {
  // nb_parents = parseInt($("#parents").html());
  // nb_siblings = parseInt($("#siblings").html());
  // nb_children = parseInt($("#children").html());

  nb_parents = 2000;
  nb_siblings = 8200;
  nb_children = 9000;

  var svg = new SVGClass($("#hierarchy"));

  var smaller_parent = drawParents(svg, nb_parents);
  var current_object = drawCurrentObject(svg);
  drawSiblings(svg, nb_siblings, smaller_parent, current_object);
  drawChildren(svg, nb_children, current_object);
});
